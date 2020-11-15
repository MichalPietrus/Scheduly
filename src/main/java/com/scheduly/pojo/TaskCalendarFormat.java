package com.scheduly.pojo;


import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class TaskCalendarFormat {

    long id;
    String title;
    String start;
    String end;
    String color;

}
