package com.ZenTask.ZenTask.DTOs;

import com.ZenTask.ZenTask.Entities.AppUser;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignUpReq {
    private AppUser user;
    private String otp;
}
