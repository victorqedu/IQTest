package com.caido.iqtest;

public class CommonFunctions {
    public static boolean isInteger(String s) {
        try { 
            Integer.valueOf(s); 
        } catch(NumberFormatException | NullPointerException e) { 
            return false; 
        }
        return true;
    }
    public static boolean isLong(String s) {
        try { 
            Long.valueOf(s); 
        } catch(NumberFormatException | NullPointerException e) { 
            return false; 
        }
        return true;
    }}
