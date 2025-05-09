package com.group03.backend_PharmaPulse.user.internal.mapper;

import com.group03.backend_PharmaPulse.user.api.dto.UsersDTO;
import com.group03.backend_PharmaPulse.user.api.dto.response.LoginSuccessResponse;
import com.group03.backend_PharmaPulse.user.api.dto.response.UserDetailsDTO;
import com.group03.backend_PharmaPulse.user.internal.entity.Users;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UsersMapper {
    @Mapping(target = "userId",ignore = true)
    Users toEntity(UsersDTO usersDTO);

    UsersDTO toDTO(Users users);
    List<UsersDTO> toDTOsList(List<Users> users);

    UserDetailsDTO toDetailsDTO(Users users);
    List<UserDetailsDTO> toUserDetailsDTOList(List<Users> users);

    LoginSuccessResponse toLoginSuccessResponse(Users users);
}
