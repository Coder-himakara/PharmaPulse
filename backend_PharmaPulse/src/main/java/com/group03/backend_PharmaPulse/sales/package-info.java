@org.springframework.modulith.ApplicationModule(
        type = ApplicationModule.Type.OPEN,
        allowedDependencies = {"order", "inventory", "product", "shared","util"}
)

package com.group03.backend_PharmaPulse.sales;

import org.springframework.modulith.ApplicationModule;