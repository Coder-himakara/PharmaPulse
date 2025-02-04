@org.springframework.modulith.ApplicationModule(
        type = ApplicationModule.Type.OPEN,
        allowedDependencies = {"product","purchase","shared", "advisor", "util"} // Added "product"
)
package com.group03.backend_PharmaPulse.inventory;

import org.springframework.modulith.ApplicationModule;