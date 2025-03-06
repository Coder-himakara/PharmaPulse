@org.springframework.modulith.ApplicationModule(
        type = ApplicationModule.Type.OPEN,
        allowedDependencies = {"product", "sales", "inventory", "shared", "util", "advisor"}
)
package com.group03.backend_PharmaPulse.order;

import org.springframework.modulith.ApplicationModule;