package com.example.demo.security;

import com.example.demo.service.JwtService;
import com.jayway.jsonpath.JsonPath;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ProjectSecurityIntegrationTest {

    private static final String PROJECT_JSON =
        "{\"title\":\"Proyecto de Ana\",\"size\":\"MEDIUM\","
        + "\"startDate\":\"2026-11-01\",\"endDate\":\"2026-12-01\"}";

    private static final String PHASE_JSON =
            "{\"name\":\"Fase\",\"orderNumber\":1,\"progress\":0,"
          + "\"weight\":1,\"dueDate\":\"2026-11-20\"}";

    @Autowired private MockMvc mockMvc;
    @Autowired private JwtService jwtService;

    private Cookie anaCookie;
    private Cookie beaCookie;
    private long anaProjectId;

    @BeforeEach
    void setUp() throws Exception {
        //nombres no repetidos para que no coincidan entre test
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        String ana = "ana_" + suffix;
        String bea = "bea_" + suffix;

        register(ana);
        register(bea);

        anaCookie = new Cookie("token", jwtService.generateToken(ana));
        beaCookie = new Cookie("token", jwtService.generateToken(bea));

        String body = mockMvc.perform(post("/projects")
            .cookie(anaCookie)
            .contentType(MediaType.APPLICATION_JSON)
            .content(PROJECT_JSON))
        .andExpect(status().isOk())
        .andReturn().getResponse().getContentAsString();

        anaProjectId = ((Number) JsonPath.read(body, "$.id")).longValue();
    }

    private void register(String username) throws Exception {
        mockMvc.perform(post("/auth/register")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"username\":\"" + username + "\",\"password\":\"Secreta-123\"}"))
        .andExpect(status().is2xxSuccessful());    
    }

    @Test
    void sinCookieNoSePuedenVerLosProyectos() throws Exception {
        mockMvc.perform(get("/projects"))
            .andExpect(status().isForbidden());
    }

    @Test 
    void conTokenInvalidoDevuelve403yNoUn500() throws Exception {
        mockMvc.perform(get("/projects").cookie(new Cookie("token", "basura.que.no.es.jwt")))
            .andExpect(status().isForbidden());
    }

     @Test
     void elDuenoVeSuProyecto() throws Exception {
        mockMvc.perform(get("/projects/" + anaProjectId).cookie(anaCookie))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.title").value("Proyecto de Ana"));
     }

    @Test
    void elListadoSoloIncluyeLosProyectosDelUsuario() throws Exception {
        mockMvc.perform(get("/projects").cookie(beaCookie))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isEmpty());
    }
    
    @Test
    void pedirElProyectoDeOtroUsuarioDa404() throws Exception {
        mockMvc.perform(get("/projects/" + anaProjectId).cookie(beaCookie))
            .andExpect(status().isNotFound());
    }

    @Test
    void editarElProyectoDeOtroUsuarioDa404YNoLoModifica() throws Exception {
        String hack = PROJECT_JSON.replace("Proyecto de Ana", "Hackeado");

        mockMvc.perform(put("/projects/" + anaProjectId)
            .cookie(beaCookie)
            .contentType(MediaType.APPLICATION_JSON)
            .content(hack))
            .andExpect(status().isNotFound());

        mockMvc.perform(get("/projects/" + anaProjectId).cookie(anaCookie))
            .andExpect(jsonPath("$.title").value("Proyecto de Ana"));
    }

     @Test
    void borrarElProyectoDeOtroUsuarioDa404YNoLoBorra() throws Exception {
        mockMvc.perform(delete("/projects/" + anaProjectId).cookie(beaCookie))
                .andExpect(status().isNotFound());

        mockMvc.perform(get("/projects/" + anaProjectId).cookie(anaCookie))
                .andExpect(status().isOk());
    }

    @Test
    void noSePuedenVerLasFasesDeUnProyectoAjeno() throws Exception {
        mockMvc.perform(get("/projects/" + anaProjectId + "/phases").cookie(beaCookie))
                .andExpect(status().isNotFound());
    }

    @Test
    void noSePuedenCrearFasesEnUnProyectoAjeno() throws Exception {
        mockMvc.perform(post("/projects/" + anaProjectId + "/phases")
                        .cookie(beaCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(PHASE_JSON))
                .andExpect(status().isNotFound());

        mockMvc.perform(get("/projects/" + anaProjectId + "/phases").cookie(anaCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());
    }
}