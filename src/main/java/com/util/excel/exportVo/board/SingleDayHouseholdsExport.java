package com.util.excel.exportVo.board;




import com.util.excel.annotation.ExcelField;

import java.sql.Date;


public class SingleDayHouseholdsExport {

    /**
     * 日期
     */
    private Date dataDate;


    /**
     * 绑定户号数新增
     */
    private String householdsNewIncrease;

    /**
     * 绑定户号数取消
     */
    private String householdsCancel;

    /**
     * 绑定户号数净增
     */
    private String householdsNetIncrease;

    /**
     * 绑定户号数累计
     */
    private String householdsTotal;


    @ExcelField(title = "日期", type = 1, align = 1, fieldType = String.class, sort = 1)
    public Date getDataDate() {
        return dataDate;
    }

    public void setDataDate(Date dataDate) {
        this.dataDate = dataDate;
    }
    @ExcelField(title = "新增绑定户号数", type = 1, align = 1, fieldType = String.class, sort = 2)
    public String getHouseholdsNewIncrease() {
        return householdsNewIncrease;
    }

    public void setHouseholdsNewIncrease(String householdsNewIncrease) {
        this.householdsNewIncrease = householdsNewIncrease;
    }
    @ExcelField(title = "取消绑定户号数", type = 1, align = 1, fieldType = String.class, sort = 3)
    public String getHouseholdsCancel() {
        return householdsCancel;
    }

    public void setHouseholdsCancel(String householdsCancel) {
        this.householdsCancel = householdsCancel;
    }
    @ExcelField(title = "净增绑定户号数", type = 1, align = 1, fieldType = String.class, sort = 4)
    public String getHouseholdsNetIncrease() {
        return householdsNetIncrease;
    }

    public void setHouseholdsNetIncrease(String householdsNetIncrease) {
        this.householdsNetIncrease = householdsNetIncrease;
    }
    @ExcelField(title = "累计绑定户号数", type = 1, align = 1, fieldType = String.class, sort = 5)
    public String getHouseholdsTotal() {
        return householdsTotal;
    }

    public void setHouseholdsTotal(String householdsTotal) {
        this.householdsTotal = householdsTotal;
    }

}
