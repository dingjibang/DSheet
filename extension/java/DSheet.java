package com.jt.cms.common;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.Iterator;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.util.CellRangeAddress;

import wsepr.easypoi.excel.Excel;
import wsepr.easypoi.excel.editor.CellEditor;
import wsepr.easypoi.excel.editor.RowEditor;
import wsepr.easypoi.excel.style.Align;
import wsepr.easypoi.excel.style.BorderStyle;
import wsepr.easypoi.excel.style.Color;
import wsepr.easypoi.excel.style.VAlign;

/**
 * DSheet java后台解析工具类<br>
 * 提供xls->json / json->xls的转换功能。
 * @author dingjibang
 *
 */
public class DSheet {
	/**
	 * 读取一个xls文件解析为dsheet特定json格式(xls->json)
	 * @param fileName 文件名
	 * @return json字符串
	 * @throws Exception 未能成功解析
	 */
	public static String read(String fileName) throws Exception{
		POIFSFileSystem fs = new POIFSFileSystem(new FileInputStream(fileName));
		HSSFWorkbook wb = new HSSFWorkbook(fs);
		HSSFSheet sheet = wb.getSheetAt(0);
		JSONObject json = new JSONObject();
		
		//读取所有行
		JSONArray rows = new JSONArray();
		int _maxCol = 0;
		for(int i=0;i<sheet.getLastRowNum();i++){
			JSONArray rowArray = new JSONArray();
			HSSFRow row = sheet.getRow(i);
			
			//遍历行里的cell
			Iterator<Cell> it = row.cellIterator();
			int _col = 0;
			while(it.hasNext()){
				if(_maxCol < _col++)
					_maxCol = _col;
				
				Cell cell = it.next();
				
				//读取值
				JSONObject cellobj = new JSONObject();
				cellobj.put("value", cell.toString());
				
				//读取样式
				JSONObject style = new JSONObject();
				CellStyle cs = cell.getCellStyle();
				style.put("bg",colorStr((HSSFColor)cs.getFillForegroundColorColor(),"ffffff"));
				style.put("fg",colorStr(wb.getFontAt(cs.getFontIndex()).getHSSFColor(wb), "000000"));
				
				int align = cs.getAlignment();
				String astr = "left";
				if(align == CellStyle.ALIGN_CENTER)
					astr = "center";
				if(align == CellStyle.ALIGN_RIGHT)
					astr = "right";
				style.put("align", astr);
				
				int valign = cs.getVerticalAlignment();
				String vastr = "top";
				if(valign == CellStyle.VERTICAL_CENTER)
					vastr = "center";
				if(valign == CellStyle.VERTICAL_BOTTOM)
					vastr = "bottom";
				style.put("valign", vastr);
				
				HSSFFont font = wb.getFontAt(cs.getFontIndex());
				style.put("bold", font.getBoldweight() == Font.BOLDWEIGHT_BOLD);  
				style.put("italic", font.getItalic());
				style.put("underline", font.getUnderline() != Font.U_NONE);
				style.put("fontName", font.getFontName());
				style.put("fontSize", (font.getFontHeight() / 20) + 2);
				style.put("borderLeft", cs.getBorderLeft());
				style.put("borderRight", cs.getBorderRight());
				style.put("borderTop", cs.getBorderTop());
				style.put("borderBottom", cs.getBorderBottom());
				
				int type = cell.getCellType();
				String typestr = "blank";
				if(type == Cell.CELL_TYPE_BOOLEAN)
					typestr = "boolean";
				if(type == Cell.CELL_TYPE_ERROR)
					typestr = "error";
				if(type == Cell.CELL_TYPE_FORMULA)
					typestr = "formula";
				if(type == Cell.CELL_TYPE_NUMERIC)
					typestr = "numeric";
				if(type == Cell.CELL_TYPE_STRING)
					typestr = "string";
				
				style.put("type", typestr);
				
				cellobj.put("style", style);
				rowArray.add(cellobj);
			}
			
			//读取行高
			JSONObject rowInfo = new JSONObject();
			rowInfo.put("height", heightUnits2Pixel(row.getHeight()));
			rowInfo.put("row", rowArray);
			
			rows.add(rowInfo);
		}
		json.put("rows", rows);
		
		
		//读取所有列的宽度
		JSONArray cellWidth = new JSONArray();
		for(int i = 0;i< _maxCol;i++){
			cellWidth.add(widthUnits2Pixel(sheet.getColumnWidth(i)));
		}
		
		json.put("cellWidth", cellWidth);
		
		
		JSONArray mergeArr = new JSONArray();
		//读取单元格合并信息
		for (CellRangeAddress address : sheet.getMergedRegions()){
			JSONObject merge = new JSONObject();
			merge.put("startRow", address.getFirstRow());
			merge.put("startCol", address.getFirstColumn());
			merge.put("endRow", address.getLastRow());
			merge.put("endCol", address.getLastColumn());
			mergeArr.add(merge);
		}
		json.put("merge", mergeArr);
		
		return json.toString();
	}
	
	public static void main(String[] args) throws Exception {
		System.out.println(read("c:/format.xls"));
		
		System.out.println(Integer.decode("0xff"));
//		read("c:/format.xls");
	}
	
	private static String colorStr(HSSFColor color,String defaultColor){
		if(color == null)
			return defaultColor;
		
		float r=color.getTriplet()[0];
		float g=color.getTriplet()[1];
		float b=color.getTriplet()[2];
		
		String hr = Integer.toHexString((int)r) + "";
		String hg = Integer.toHexString((int)g) + "";
		String hb = Integer.toHexString((int)b) + "";
		
		hr = hr.length() == 1 ? "0"+hr : hr;
		hg = hg.length() == 1 ? "0"+hg : hg;
		hb = hb.length() == 1 ? "0"+hb : hb;
		
		return hr + hg + hb;
		
	}
	
	
	/**
	 * @author http://ragnarock99.blogspot.jp/2012/05/getting-cell-witdth-from-excel-with.html
	 */
	public static final short EXCEL_COLUMN_WIDTH_FACTOR = 256;
	public static final short EXCEL_ROW_HEIGHT_FACTOR = 20;
	public static final int UNIT_OFFSET_LENGTH = 7;
	public static final int[] UNIT_OFFSET_MAP = new int[] { 0, 36, 73, 109, 146, 182, 219 };

	private static short pixel2WidthUnits(int pxs) {
		short widthUnits = (short) (EXCEL_COLUMN_WIDTH_FACTOR * (pxs / UNIT_OFFSET_LENGTH));
		widthUnits += UNIT_OFFSET_MAP[(pxs % UNIT_OFFSET_LENGTH)];
		return widthUnits;
	}

	private static int widthUnits2Pixel(int widthUnits) {
		int pixels = (widthUnits / EXCEL_COLUMN_WIDTH_FACTOR) * UNIT_OFFSET_LENGTH;
		int offsetWidthUnits = widthUnits % EXCEL_COLUMN_WIDTH_FACTOR;
		pixels += Math.floor((float) offsetWidthUnits / ((float) EXCEL_COLUMN_WIDTH_FACTOR / UNIT_OFFSET_LENGTH));
		return pixels;
	}

	private static int heightUnits2Pixel(short heightUnits) {
		int pixels = (heightUnits / EXCEL_ROW_HEIGHT_FACTOR);
		int offsetWidthUnits = heightUnits % EXCEL_ROW_HEIGHT_FACTOR;
		pixels += Math.floor((float) offsetWidthUnits / ((float) EXCEL_ROW_HEIGHT_FACTOR / UNIT_OFFSET_LENGTH));
		return pixels;
	}
	
	/**
	 * json -> xls
	 */
	public static File save(String param,File file) throws Exception {
		JSONObject json = JSONObject.fromObject(param);
		
		Excel excel = new Excel();
		HSSFWorkbook wb = excel.getWorkBook();
		
		JSONArray rows = json.getJSONArray("rows");
		
		for(int i=0;i<rows.size();i++){
			JSONObject rowInfo = rows.getJSONObject(i);
			RowEditor row = excel.row();
			row.height((float)rowInfo.getDouble("height") - 1);
			
			JSONArray cells = rowInfo.getJSONArray("row");
			excel.sheet().toHSSFSheet().setDefaultColumnStyle(cells.size(), wb.createCellStyle());
			for(int j=0;j<cells.size();j++){
				JSONObject jcell = cells.getJSONObject(j);
				final JSONObject jstyle = jcell.getJSONObject("style");
				
				CellEditor cell = excel.cell(i, j);
				HSSFCell hc = cell.toHSSFCell();
				String color = jstyle.getString("bg");
				
				hc.setCellStyle(wb.createCellStyle());
				if(!color.equalsIgnoreCase("ffffff")){
					hc.getCellStyle().setFillForegroundColor(getColor(wb, color));
					hc.getCellStyle().setFillPattern(CellStyle.SOLID_FOREGROUND);
				}
				
				cell.align(Align.valueOf(jstyle.getString("align").toUpperCase()));
				cell.vAlign(VAlign.valueOf(jstyle.getString("valign").toUpperCase()));
				
				cell.borderLeft((short)jstyle.getInt("borderLeft") == 0 ? BorderStyle.NONE : BorderStyle.THIN, Color.BLACK);
				cell.borderRight((short)jstyle.getInt("borderRight") == 0 ? BorderStyle.NONE : BorderStyle.THIN, Color.BLACK);
				cell.borderTop((short)jstyle.getInt("borderTop") == 0 ? BorderStyle.NONE : BorderStyle.THIN, Color.BLACK);
				cell.borderBottom((short)jstyle.getInt("borderBottom") == 0 ? BorderStyle.NONE : BorderStyle.THIN, Color.BLACK);
				
				String typestr = jstyle.has("type") ? jstyle.getString("type").toLowerCase() : "blank";
				short type = Cell.CELL_TYPE_BLANK;
				if(typestr.equals("boolean")) type = Cell.CELL_TYPE_BOOLEAN;
				if(typestr.equals("error")) type = Cell.CELL_TYPE_ERROR;
				if(typestr.equals("formula")) type = Cell.CELL_TYPE_FORMULA;
				if(typestr.equals("numeric")) type = Cell.CELL_TYPE_NUMERIC;
				if(typestr.equals("string")) type = Cell.CELL_TYPE_STRING;
				
				HSSFFont font = wb.createFont();
				font.setColor(getColor(wb, jstyle.getString("fg")));//				
				font.setBold(jstyle.getBoolean("bold"));
				font.setItalic(jstyle.getBoolean("italic"));
				font.setUnderline(jstyle.getBoolean("underline") ? HSSFFont.U_SINGLE : HSSFFont.U_NONE);
				font.setFontName(jstyle.getString("fontName"));
				font.setFontHeight((short)((Integer.parseInt(jstyle.getString("fontSize").split("px")[0]) - 2) * 20));
				hc.getCellStyle().setFont(font);
				
				Object val = jcell.get("value");
				if(type == Cell.CELL_TYPE_FORMULA){
					hc.setCellFormula(val.toString());
					hc.setCellType(type);
				}else if(type ==Cell.CELL_TYPE_NUMERIC){
					double d = 0;
					try {
						d = Double.parseDouble(val.toString());
					} catch (Exception e) {}
					if(val.toString().length() != 0)
						hc.setCellValue(d);
					hc.setCellType(type);
				}else{
					cell.value(val.toString().length() == 0 ? null : val.toString());
				}
					
			}
		}
		
		JSONArray cellWidth = json.getJSONArray("cellWidth");
		for(int i=0;i<cellWidth.size();i++)
			excel.column(i).width(pixel2WidthUnits(cellWidth.getInt(i) + 1));
		
		JSONArray merges = json.getJSONArray("merge");
		for(int i=0;i<merges.size();i++){
			JSONObject merge = merges.getJSONObject(i);
			excel.region(merge.getInt("startRow"), merge.getInt("startCol"), merge.getInt("endRow"), merge.getInt("endCol")).merge();
		}
		
		FileOutputStream fos = new FileOutputStream(file);
		wb.write(fos);
		fos.close();
		return file;
	}
	
	private static short getColor(HSSFWorkbook wb,String hex){
		if(hex.length() != 6)
			return 0;
		
		String rr = "0x"+hex.substring(0,2);
		String gg = "0x"+hex.substring(2,4);
		String bb = "0x"+hex.substring(4,6);
		
		int r = (Integer.decode(rr));
		int g = (Integer.decode(gg));
		int b = (Integer.decode(bb));
		HSSFColor color = wb.getCustomPalette().findSimilarColor(r,g,b);
		byte rbyte = (byte)(r+0);
		byte gbyte = (byte)(g+0);
		byte bbyte = (byte)(b+0);
		
		//这什么鬼方法。
		if(color == null) color = wb.getCustomPalette().findColor(rbyte,gbyte,bbyte);
		if(color == null) color = wb.getCustomPalette().addColor(rbyte, gbyte, bbyte);
		if(color == null) return 0;
		
		return color.getIndex();
	}
}
