package com.util;

import org.apache.commons.lang3.time.DateFormatUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

/**
 * @Author: duanww
 * @Date: 2018/12/19 16:17
 */
public class DateUtils {
    private static final Logger logger = LoggerFactory.getLogger(DateUtils.class);

    /**
     * 格式化utc类型的时间 如：2018-12-17T16:00:00.000Z
     * @param UTCString
     * @return
     */
    public static String paseString(String UTCString) {
        SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
        SimpleDateFormat sdf2 = new SimpleDateFormat("yyyy-MM-dd");
        String str = null;
        try {
            if ("".equals(UTCString) || null == UTCString) {
                return null;
            }
            Date date = sdf1.parse(UTCString);//拿到Date对象
            str = sdf2.format(date);//输出格式：2017-01-22 09:28:33
        } catch (Exception e) {
            e.printStackTrace();
        }
        return str;
    }

    /**
     * java.sql.date类型的时间串   转化成 util类型
     * @param dataDate
     * @return
     */
    public static Date getDate(String dataDate) {
        Date date = null;
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        try {
            date = sdf.parse(dataDate);
        } catch (ParseException e) {
            logger.info("时间转换错误");
        }
        return date;
    }

    /**
     * 格式化GMT类型的时间 如：Tue Dec 18 2018 00:00:00 GMT+0800 (中国标准时间)
     * @param datdString
     * @return
     */

    public  static String changeGmtTimeToDateTime(String datdString) {
        datdString = datdString.replace("GMT", "").replaceAll("\\(.*\\)", "");
        //将字符串转化为date类型，格式2016-10-12
        SimpleDateFormat format = new SimpleDateFormat("EEE MMM dd yyyy HH:mm:ss z", Locale.ENGLISH);
        Date dateTrans = null;
        try {
            dateTrans = format.parse(datdString);
            return new SimpleDateFormat("yyyy-MM-dd").format(dateTrans);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return datdString;

    }

    /**
     * 计算某个日期的前后几天  后几天number为正  ，前几天number为负
     * @param date
     * @param number
     * @return
     */
    public static String getDateBefore(Date date, int number) {
        SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.DAY_OF_MONTH, number);
        date = calendar.getTime();
        return sdf.format(date);
    }

    /**
     * 通过时间秒毫秒数判断两个时间的间隔
     * @param date1
     * @param date2
     * @return
     */
    public static  int differentDaysByMillisecond(Date date1, Date date2)
    {
        int days = (int) ((date2.getTime() - date1.getTime()) / (1000*3600*24));
        return days;
    }


    public static String parseDate(Date date, String datepattern) {
        //Date date=new Date();//取时间
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        date=calendar.getTime();
        String dateString = DateFormatUtils.format(date, datepattern);
        return dateString;
    }
}
