@org.springframework.modulith.ApplicationModule(
        type = ApplicationModule.Type.OPEN,
        allowedDependencies = {"shared", "advisor", "util"} // List all modules that can depend on 'product'
)
package com.group03.backend_PharmaPulse.product;

import org.springframework.modulith.ApplicationModule;