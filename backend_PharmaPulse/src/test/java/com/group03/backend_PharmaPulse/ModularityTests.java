package com.group03.backend_PharmaPulse;

import org.junit.jupiter.api.Test;
import org.springframework.modulith.core.ApplicationModules;

class ModularityTests {
    ApplicationModules modules = ApplicationModules.of(BackendPharmaPulseApplication.class);

    @Test
    void verifyModules() {
        System.out.println(modules.toString());
        modules.verify();
    }
}
