package com.util.excel.exportVo.board;


import com.util.excel.annotation.ExcelField;

public class CollectAttentionExport {

    /**
     * 周期
     */
    private String dataDate;


    /**
     * 新增绑定数
     */
    private String attentionNewIncreaseValue;

    /**
     * 日均新增绑定数
     */
    private String attentionNewIncreaseAVG;

    /**
     * 取消绑定数
     */
    private String attentionCancelValue;

    /**
     * 日均取消绑定数
     */
    private String attentionCancelAVG;

    /**
     * 	净增绑定数
     */
    private String attentionNetIncrease;

    @ExcelField(title = "周期", type = 1, align = 1, fieldType = String.class, sort = 1)
    public String getDataDate() {
        return dataDate;
    }

    public void setDataDate(String dataDate) {
        this.dataDate = dataDate;
    }
    @ExcelField(title = "新增绑定数", type = 1, align = 1, fieldType = String.class, sort = 2)
    public String getAttentionNewIncreaseValue() {
        return attentionNewIncreaseValue;
    }

    public void setAttentionNewIncreaseValue(String attentionNewIncreaseValue) {
        this.attentionNewIncreaseValue = attentionNewIncreaseValue;
    }
    @ExcelField(title = "日均新增绑定数", type = 1, align = 1, fieldType = String.class, sort = 3)
    public String getAttentionNewIncreaseAVG() {
        return attentionNewIncreaseAVG;
    }

    public void setAttentionNewIncreaseAVG(String attentionNewIncreaseAVG) {
        this.attentionNewIncreaseAVG = attentionNewIncreaseAVG;
    }
    @ExcelField(title = "取消绑定数", type = 1, align = 1, fieldType = String.class, sort = 4)
    public String getAttentionCancelValue() {
        return attentionCancelValue;
    }

    public void setAttentionCancelValue(String attentionCancelValue) {
        this.attentionCancelValue = attentionCancelValue;
    }
    @ExcelField(title = "日均取消绑定数", type = 1, align = 1, fieldType = String.class, sort = 5)
    public String getAttentionCancelAVG() {
        return attentionCancelAVG;
    }

    public void setAttentionCancelAVG(String attentionCancelAVG) {
        this.attentionCancelAVG = attentionCancelAVG;
    }
    @ExcelField(title = "净增绑定数", type = 1, align = 1, fieldType = String.class, sort = 6)
    public String getAttentionNetIncrease() {
        return attentionNetIncrease;
    }

    public void setAttentionNetIncrease(String attentionNetIncrease) {
        this.attentionNetIncrease = attentionNetIncrease;
    }
}
