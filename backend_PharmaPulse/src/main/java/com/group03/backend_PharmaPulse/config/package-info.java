@org.springframework.modulith.ApplicationModule(
        type = ApplicationModule.Type.OPEN,
        allowedDependencies = {"shared", "advisor", "util","user"}
)
package com.group03.backend_PharmaPulse.config;

import org.springframework.modulith.ApplicationModule;