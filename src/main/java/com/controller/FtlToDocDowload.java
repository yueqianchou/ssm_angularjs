package com.controller;

import com.alibaba.fastjson.JSONObject;
import freemarker.template.Template;
import freemarker.template.TemplateException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.view.freemarker.FreeMarkerConfigurer;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

@Service
public class FtlToDocDowload {
    private  static  final Logger logger = LoggerFactory.getLogger(TestController.class);
    @Autowired
    private FreeMarkerConfigurer freeMarkerConfigurer;


    public void downLoadDoc(String srcName, String templateName, JSONObject param, HttpServletRequest request, HttpServletResponse response) {
        try {
            String dlname = "";
            if (request.getHeader("User-Agent").toUpperCase().indexOf("MSIE") > 0) {
                dlname = URLEncoder.encode(srcName, "UTF-8");
            } else {
                dlname = new String(srcName.getBytes("UTF-8"), "ISO8859-1");
            }

            response.reset();
            response.setContentType("application/octet-stream");
            response.setCharacterEncoding("utf-8");
            response.setHeader("Content-Disposition","attachment;filename=\""+dlname+"\"");
            response.setHeader("Connection","close");
            createDoc(templateName,param,response.getWriter());

        } catch (IOException e) {
            logger.error("文件读取错误");
        }
    }

    private void createDoc(String templateName, JSONObject param, PrintWriter out) {
        try {
            Template template = freeMarkerConfigurer.getConfiguration().getTemplate(templateName);
            template.setEncoding("UTF-8");
            template.process(param,out);
        } catch (IOException e) {
            logger.error("获取文件输出流出错");
        } catch (TemplateException e) {
            logger.error("模板路径错误");
        }finally {
            if(out !=null){
                out.close();
            }
        }
    }
}
