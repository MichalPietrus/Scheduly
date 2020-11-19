package com.scheduly.pojo;


import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
@NoArgsConstructor
public class ProjectPojo {

    long tableId;
    long tableRowId;
    String taskTitle;
    String projectTitle;
    String choosedOption;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    Date date;

}
