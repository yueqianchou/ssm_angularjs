package com.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class LoginController {

 	@RequestMapping("/analysis")
	public  String  gotoAnalysis(){
		return "analysis";
	}
 	@RequestMapping("/system-config")
	public  String  gotoSystemConfig(){
		return "sys-config";
	}




}
