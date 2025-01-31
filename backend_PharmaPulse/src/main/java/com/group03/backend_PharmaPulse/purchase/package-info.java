@ApplicationModule(
        allowedDependencies = {"advisor","common","config","exception","util","inventory::inventory-entity",
        "inventory::inventory-repository","inventory::inventory-service","common::common-mapper"}
)
package com.group03.backend_PharmaPulse.purchase;

import org.springframework.modulith.ApplicationModule;