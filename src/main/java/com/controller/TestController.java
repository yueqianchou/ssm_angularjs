package com.controller;

import com.alibaba.fastjson.JSONObject;
import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.freemarker.FreeMarkerConfigurer;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;

@Controller
public class TestController {
	private  static  final Logger logger = LoggerFactory.getLogger(TestController.class);
	@Autowired
	private FtlToDocDowload ftlToDocDowload;
	/*@RequestMapping("upload.do")
	public String upload(@RequestParam MultipartFile[] attachs,HttpServletRequest request){
		String savepath= request.getSession().getServletContext().getRealPath("upload");
		for (MultipartFile attach : attachs) {
			if(!attach.isEmpty()){
				File savefile= new File(savepath+"/"+attach.getOriginalFilename());
				try {
					FileUtils.copyInputStreamToFile(attach.getInputStream(), savefile);
				} catch (IOException e) {
					e.printStackTrace();
				}
				request.setAttribute("message", "文件上传成功");
			}
		}


		return "index";
	}*/

//	@RequestMapping("ceshi.do")
//	public String ceshi(HttpServletRequest request){
//		request.setAttribute("message", "测试成功进来了");
//
//		return "index";
//
//	}

 	@RequestMapping("ceshi.do")
	public  @ResponseBody JSONObject ceshi(){
		JSONObject result = new JSONObject();
		result.put("message", "测试成功");
		return result;

	}

	@RequestMapping("test/upload")
	@ResponseBody
	public JSONObject upload(@RequestParam MultipartFile[] attachs,HttpServletRequest request){
		String savepath= request.getSession().getServletContext().getRealPath("upload");
		for (MultipartFile attach : attachs) {
			if(!attach.isEmpty()){
				File savefile= new File(savepath+"/"+attach.getOriginalFilename());
				try {
					FileUtils.copyInputStreamToFile(attach.getInputStream(), savefile);
				} catch (IOException e) {
					e.printStackTrace();
				}
				//request.setAttribute("message", "文件上传成功");
			}
		}

		JSONObject result = new JSONObject();
		result.put("message", "文件上传成功");
		return result;
	}

	@RequestMapping("test/downLoadFile")
	public void downLoadFile(HttpServletResponse response){
 		//String[] classpath= this.getClass().getResource("/").getPath().split("WEB-INF");
		try {
			String path="E://idea_workspace/downloadfile/downLoad.txt";
			// path是指欲下载的文件的路径。
			File file = new File(path);
			// 取得文件名。
			String filename = file.getName();

			// 以流的形式下载文件。
			InputStream fis = new BufferedInputStream(new FileInputStream(path));
			byte[] buffer = new byte[fis.available()];
			fis.read(buffer);
			fis.close();
			// 清空response
			response.reset();
			// 设置response的Header
			response.addHeader("Content-Disposition", "attachment;filename=" + new String(filename.getBytes()));
			response.addHeader("Content-Length", "" + file.length());
			OutputStream toClient = new BufferedOutputStream(response.getOutputStream());
			response.setContentType("application/octet-stream");
			toClient.write(buffer);
			toClient.flush();
			toClient.close();
		} catch (IOException ex) {
			logger.error("文件未找到"+ex);
		}
	}

	@RequestMapping("test/downLoadFile_doc")
	public void downLoadDoc(HttpServletResponse response,HttpServletRequest request){
 	    JSONObject param = new JSONObject();
 	    param.put("name" , "李寻欢");
 	    param.put("position" , "探花");
        ftlToDocDowload.downLoadDoc("word下载.doc","wordftl.ftl",param,request,response);
	}



}
