package com.group03.backend_PharmaPulse.util;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@NoArgsConstructor
@Data
@Setter
@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class StandardResponse {
    private int code;
    private String message;
    private Object data;

    public StandardResponse(int code, String message, Object data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }
}
