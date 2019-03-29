package com.util;

import org.apache.commons.httpclient.*;
import org.apache.commons.httpclient.auth.AuthScope;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.apache.webdav.lib.WebdavResource;
import org.apache.webdav.lib.methods.MkcolMethod;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.MalformedURLException;
import java.util.Date;

/**
 * webDav 工具类
 *
 * @author shengyue.zhang
 */
public class WebDavUtil {

    private static final Logger logger = LoggerFactory.getLogger(WebDavUtil.class);

    private static boolean createWebDavFilePath(HttpClient client,
                                                String urlPath, String urlDir) throws Exception {
        Thread.currentThread().setContextClassLoader(WebDavUtil.class.getClassLoader());
        try {
            if (!urlDir.endsWith("/")) {
                urlDir += "/";
            }
            //查询目录
            GetMethod get = new GetMethod(urlPath + urlDir);
            client.executeMethod(get);

            int statusCode = get.getStatusCode();
            logger.info("===========Get method:" + urlPath + urlDir
                    + "," + get.getStatusCode()
                    + ":" + get.getStatusText() + "============");
            if (404 == statusCode) {
                //目录不存在,递归创建父目录
                String parentPath = urlDir.substring(0, urlDir.length() - 1);
                parentPath = parentPath.substring(0, parentPath.lastIndexOf("/") + 1);
                if (createWebDavFilePath(client, urlPath, parentPath)) {
                    //成功后，创建子目录
                    MkcolMethod mkcol = new MkcolMethod(urlPath + urlDir);
                    client.executeMethod(mkcol);
                    logger.info("========MkCol:" + urlPath + urlDir
                            + "," + mkcol.getStatusCode()
                            + ":" + mkcol.getStatusText() + "=========");
                } else {
                    return false;
                }
            }
            return true;
        } catch (Exception e) {
            return false;
        }
    }


    /**
     * 将byte[]转换成InputStream
     *
     * @param b
     * @return
     */
    public static InputStream Byte2InputStream(byte[] b) {
        ByteArrayInputStream bais = new ByteArrayInputStream(b);
        return bais;
    }

    /**
     * InputStream 转byte数组
     *
     * @param in
     * @return
     */
    public static byte[] inputStream2byte(InputStream in) {
        BufferedInputStream bufin = new BufferedInputStream(in);
        int buffSize = 1024;
        ByteArrayOutputStream out = new ByteArrayOutputStream(buffSize);
        byte[] temp = new byte[buffSize];
        int size = 0;
        try {
            while ((size = bufin.read(temp)) != -1) {
                out.write(temp, 0, size);
            }
            byte[] content = out.toByteArray();
            return content;
        } catch (IOException e) {
            logger.error("", e);
        }
        return null;
    }

    /**
     * 上传文件☞ WebDav
     *
     * @param fileName 文件名
     * @param file     文件流
     * @return
     */
    public static final String putFileToWebDAV(String url, String user, String pwd, String fileName, byte[] file) {
        ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
        String retName = null;
        try {
            Thread.currentThread().setContextClassLoader(WebDavUtil.class.getClassLoader());
            String date = DateFormatUtils.format(new Date(), "yyyyMMdd");
            retName = fileName;
            putFileToWebDAV(url, retName, fileName, user, pwd, Byte2InputStream(file));
        } finally {
            Thread.currentThread().setContextClassLoader(classLoader);
        }
        return retName;
    }

    /**
     * 上传文件
     *
     * @param url
     * @param remotePath
     * @param urlFileName
     * @param uid
     * @param pwd
     * @param file
     * @return
     */
    public static final boolean putFileToWebDAV(String url, String remotePath,
                                                String urlFileName, String uid, String pwd, InputStream file) {

        Thread.currentThread().setContextClassLoader(WebDavUtil.class.getClassLoader());
        boolean bool = false;
        HttpClient client = new HttpClient();
        Credentials credentials = new UsernamePasswordCredentials(uid, pwd);
        AuthScope authScope = new AuthScope(AuthScope.ANY);
        client.getState().setCredentials(authScope, credentials);
        try {
            createWebDavFilePath(client, url, remotePath);
            HttpURL hrl = new HttpURL(url);
            hrl.setUserinfo(uid, pwd);
            WebdavResource wdr = new WebdavResource(hrl);
            String path = wdr.getPath();
            if (!path.endsWith("/")) {
                path += "/";
            }
            path = path + remotePath + "/" + urlFileName;
            try // 尝试锁定
            {
                wdr.setPath(path);
                if (wdr.isLocked()) {
                    wdr.unlockMethod();
                    bool = wdr.putMethod(path, file);

                } else {
                    bool = wdr.putMethod(path, file);
                }

            } catch (Exception ex) {
                bool = wdr.putMethod(path, file);
            } finally {
                wdr.close();
            }
        } catch (MalformedURLException mue) {
            logger.error("{}", mue);
        } catch (HttpException he) {
            logger.error("{}", he);

        } catch (IOException ioe) {
            logger.error("{}", ioe);

        } catch (Exception ex) {
            logger.error("{}", ex);
        } finally {
            if (file != null) {
                try {
                    file.close();
                } catch (IOException e) {
                    logger.error("", e);
                }
            }
        }
        return bool;
    }

    /**
     * 下载显示webdav文件
     *
     * @param request
     * @param response
     * @return
     */
    public static final String wevDown(String url, String user, String pwd, String fileName, HttpServletRequest request, HttpServletResponse response) {
        Thread.currentThread().setContextClassLoader(WebDavUtil.class.getClassLoader());
        HttpURL hrl;
        OutputStream os = null;
        InputStream is = null;
        try {
            hrl = new HttpURL(url);
            hrl.setUserinfo(user, pwd);
            WebdavResource wdr = new WebdavResource(hrl);
            is = wdr.getMethodData();
            byte[] buf = inputStream2byte(is);
            response.setHeader("Pragma", "No-cache");
            response.setHeader("Cache-Control", "no-cache");
            response.setDateHeader("Expires", 0);
            response.reset();
            response.setCharacterEncoding("UTF-8");
            response.setContentLength(buf.length);
            if (StringUtils.isNotEmpty(fileName)) {
                response.setHeader("Content-Disposition", "attachment; filename=" + java.net.URLEncoder.encode(RegexpUtil.replaceBlank(fileName), "UTF-8"));
            } else {
                response.setHeader("Content-disposition", "attachment;filename=");
            }
            os = response.getOutputStream();
            os.write(buf);
            os.flush();
            logger.info("show webdav url ok");
        } catch (URIException e1) {
            logger.error("", e1);
        } catch (HttpException e) {
            logger.error("", e);
        } catch (IOException e) {
            logger.error("", e);
        } finally {
            if (os != null) {
                try {
                    os.close();
                } catch (IOException e) {
                }
            }
            if (is != null) {
                try {
                    is.close();
                } catch (IOException e) {
                }
            }
        }
        return null;
    }

    /**
     * 下载文件
     *
     * @param url
     * @param user
     * @param pwd
     * @return
     */
    public static final byte[] webDavDown(String url, String user, String pwd) {
        Thread.currentThread().setContextClassLoader(WebDavUtil.class.getClassLoader());

        HttpURL hrl;
        InputStream is = null;
        logger.info(url);
        try {
            hrl = new HttpURL(url);
            hrl.setUserinfo(user, pwd);
            WebdavResource wdr = new WebdavResource(hrl);
            is = wdr.getMethodData();
            byte[] buf = inputStream2byte(is);
            return buf;
        } catch (Exception e) {
            logger.error("", e);
        } finally {
            if (is != null) {
                try {
                    is.close();
                } catch (IOException e) {
                }
            }
        }
        return null;
    }

    /**
     * 获得指定文件的byte数组
     */
    public static final byte[] getBytes(File file) {
        byte[] buffer = null;
        try {
            FileInputStream fis = new FileInputStream(file);
            ByteArrayOutputStream bos = new ByteArrayOutputStream(1024);
            byte[] b = new byte[1024];
            int n;
            while ((n = fis.read(b)) != -1) {
                bos.write(b, 0, n);
            }
            fis.close();
            bos.close();
            buffer = bos.toByteArray();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return buffer;
    }

    /**
     * 列出目录下的文件
     */
    public static String[] listFiles(String url, String user, String pwd, String pathUrl) {
        Thread.currentThread().setContextClassLoader(WebDavUtil.class.getClassLoader());
        HttpURL hrl;
        String[] fileName = null;
        try {
            hrl = new HttpURL(url);
            hrl.setUserinfo(user, pwd);
            logger.info("123");
            WebdavResource wdr = new WebdavResource(hrl);
            logger.info("进入");
            //获取服务器当前目录
            String path = wdr.getPath();
            logger.info("服务器当前目录===>" + path);
            if (!path.endsWith("/")) {
                path += "/";
            }
            path = path + pathUrl;
            logger.info("设置后服务器当前目录===>" + path);
            //设置路径为现在服务器的当前目录
            wdr.setPath(path);

            fileName = wdr.list();
            return fileName;
        } catch (Exception e) {
            logger.error("", e);
            return fileName;
        }
    }

    /**
     * 创建文件
     */
    public static final boolean createFile(String url, String user, String pwd, String remotePath) {

        Thread.currentThread().setContextClassLoader(WebDavUtil.class.getClassLoader());
        boolean bool = false;
        HttpClient client = new HttpClient();
        Credentials credentials = new UsernamePasswordCredentials(user, pwd);
        AuthScope authScope = new AuthScope(AuthScope.ANY);
        client.getState().setCredentials(authScope, credentials);
        try {
            createWebDavFilePath(client, url, remotePath);
            bool = true;
        } catch (Exception e) {
            logger.error("", e);
        }
        return bool;
    }

    /**
     * 查询目录是否存在
     */
    public static final boolean findFile(String url, String user, String pwd, String remotePath) {

        Thread.currentThread().setContextClassLoader(WebDavUtil.class.getClassLoader());
        boolean bool = false;
        HttpClient client = new HttpClient();
        Credentials credentials = new UsernamePasswordCredentials(user, pwd);
        AuthScope authScope = new AuthScope(AuthScope.ANY);
        client.getState().setCredentials(authScope, credentials);
        try {
            createWebDavFilePath(client, url, remotePath);
            if (!remotePath.endsWith("/")) {
                remotePath += "/";
            }
            //查询目录
            GetMethod get = new GetMethod(url + remotePath);
            client.executeMethod(get);

            int statusCode = get.getStatusCode();
            logger.info("===========Get method:" + url + remotePath
                    + "," + get.getStatusCode()
                    + ":" + get.getStatusText() + "============");
            if (404 == statusCode) {
                return false;
            }
            return true;
        } catch (Exception e) {
            logger.error("", e);
            return false;
        }
    }

    public static void inputStreamToFile(InputStream ins, File file) {
        OutputStream os = null;
        try {
            os = new FileOutputStream(file);
            int bytesRead = 0;
            byte[] buffer = new byte[1024];
            while ((bytesRead = ins.read(buffer, 0, 1024)) != -1) {
                os.write(buffer, 0, bytesRead);
            }

        } catch (Exception e) {
            logger.error("", e);
        } finally {
            if (os != null) {
                try {
                    os.close();
                } catch (IOException e) {
                    // TODO Auto-generated catch block
                    logger.error("", e);
                }
            }
            if (ins != null) {
                try {
                    ins.close();
                } catch (IOException e) {
                    // TODO Auto-generated catch block
                    logger.error("", e);
                }
            }
        }
    }


    public static void main(String[] args) throws Exception {
        String webDavUrl = "http://10.139.38.228:12080/webdav/";
        String userName = "bangdao_jsgw";
        String passWord = "123456";
        //File file = new File("D:/tomcat/apache-tomcat-7.0.85/webapps/nosgmanager-server/campHtml/1001/css/index.css");
        String sourceDir = "test/";
        String[] list = WebDavUtil.listFiles(webDavUrl, userName, passWord, sourceDir);
        String ko = "G:/test/";
        FileInputStream fi = new FileInputStream(new File("G:\\test.pptx"));
        putFileToWebDAV(webDavUrl,sourceDir,"test.pptx",userName,passWord,fi);
//        try {
//            if (list != null) {
//                for (String fileName : list) {
//                    logger.info("文件名===>" + fileName);
//                    byte[] buf = WebDavUtil.webDavDown(webDavUrl, userName, passWord, sourceDir + fileName);
//                    InputStream inputStream = Byte2InputStream(buf);
//                    logger.info("此处字节长度===>" + buf.length);
//                    File targetFile = new File(ko + fileName);
//                    inputStreamToFile(inputStream, targetFile);
//                }
//            }
//        } catch (Exception e) {
//            logger.info("", e);
//            e.printStackTrace();
//        }
    }
}
