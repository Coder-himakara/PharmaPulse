@org.springframework.modulith.ApplicationModule(
        type = ApplicationModule.Type.OPEN,
        allowedDependencies = {"shared", "advisor","util","config","user"}
)
package com.group03.backend_PharmaPulse.initializer;

import org.springframework.modulith.ApplicationModule;