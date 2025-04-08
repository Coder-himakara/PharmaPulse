@org.springframework.modulith.ApplicationModule(
        type = ApplicationModule.Type.OPEN,
        allowedDependencies = {"shared", "advisor","util","config","product","purchase","sales","inventory"}
)
package com.group03.backend_PharmaPulse.report;

import org.springframework.modulith.ApplicationModule;