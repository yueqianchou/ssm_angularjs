package com.util;

import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;

import java.io.*;

public class Testimp {

    public void testimp(){
        File file = new File("E:\\a.xls");
        try {
            InputStream is= new FileInputStream(file);
            HSSFWorkbook wb = new HSSFWorkbook(is);
            HSSFSheet sheet= wb.getSheetAt(0);
            for(int i = 1 ; i<=sheet.getLastRowNum();i++){
                String[] singleRow = new String[5];
                int n = 0;
                HSSFRow row = sheet.getRow(i);
                for(int j = 0 ; j <row.getLastCellNum();j++){
                    Cell cell = row.getCell(j, Row.CREATE_NULL_AS_BLANK);
                    switch(cell.getCellType()){
                        case Cell.CELL_TYPE_BLANK:
                            singleRow[n] = "";
                            break;
                        case Cell.CELL_TYPE_BOOLEAN:
                            singleRow[n] = Boolean.toString(cell.getBooleanCellValue());
                            break;
                        //数值
                        case Cell.CELL_TYPE_NUMERIC:
                            if(DateUtil.isCellDateFormatted(cell)){
                                singleRow[n] = String.valueOf(cell.getDateCellValue());
                            }else{
                                cell.setCellType(Cell.CELL_TYPE_STRING);
                                String temp = cell.getStringCellValue();
                                //判断是否包含小数点，如果不含小数点，则以字符串读取，如果含小数点，则转换为Double类型的字符串
                                if(temp.indexOf(".")>-1){
                                    singleRow[n] = String.valueOf(new Double(temp)).trim();
                                }else{
                                    singleRow[n] = temp.trim();
                                }
                            }
                            break;
                        case Cell.CELL_TYPE_STRING:
                            singleRow[n] = cell.getStringCellValue().trim();
                            break;
                        case Cell.CELL_TYPE_ERROR:
                            singleRow[n] = "";
                            break;
                        case Cell.CELL_TYPE_FORMULA:
                            cell.setCellType(Cell.CELL_TYPE_STRING);
                            singleRow[n] = cell.getStringCellValue();
                            if(singleRow[n]!=null){
                                singleRow[n] = singleRow[n].replaceAll("#N/A","").trim();
                            }
                            break;
                        default:
                            singleRow[n] = "";
                            break;
                    }
                    System.out.print(singleRow[n]+"\t");
                    n++;

                }
                System.out.println();
            }



        } catch (FileNotFoundException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }


    public static void main(String[] args) {
        Testimp t = new Testimp();
        t.testimp();
    }
}
