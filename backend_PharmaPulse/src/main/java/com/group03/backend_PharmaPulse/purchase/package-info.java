@org.springframework.modulith.ApplicationModule(
        type = ApplicationModule.Type.OPEN,
        allowedDependencies = {"product","shared", "advisor", "exception", "util","inventory"} // Added "product"
)
package com.group03.backend_PharmaPulse.purchase;

import org.springframework.modulith.ApplicationModule;