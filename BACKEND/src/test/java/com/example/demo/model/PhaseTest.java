package com.example.demo.model;

import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class PhaseTest {

    private Phase phase(int progress, LocalDate dueDate) {
        return Phase.builder()
            .name("Fase de prueba")
            .orderNumber(1)
            .progress(progress)
            .weight(1)
            .dueDate(dueDate)
            .build();
    }

    @Test
    void isDelayed_fechaVencidaYSinCompletar_devuelveTrue() {
        Phase phase = phase(50, LocalDate.now().minusDays(1));

        assertTrue(phase.isDelayed());
    }

    @Test
    void isDelayed_fechaVencidaPeroCompletada_devuelveFalse() {
        Phase phase = phase(100, LocalDate.now().minusDays(1));

        assertFalse(phase.isDelayed());
    }

    @Test
    void isDelayed_fechaFutura_devuelveFalse() {
        Phase phase = phase(0, LocalDate.now().plusDays(3));

        assertFalse(phase.isDelayed());
    }

    @Test
    void isDelayed_venceHoy_devuelveFalse() {
        //el dia limite todavia cuenta como que está a tiempo
        Phase phase = phase(20, LocalDate.now());

        assertFalse(phase.isDelayed());
    }

    @Test
    void isDelayed_sinFechaLimite_devuelveFalse() {
        Phase phase = phase(0, null);

        assertFalse(phase.isDelayed());
    }
}