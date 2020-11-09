package com.scheduly.pojo;

import com.scheduly.enums.Priority;
import com.scheduly.enums.Status;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class TaskPojo {

    private long id;
    private long sequence;
    private String title;
    private LocalDateTime fromDate;
    private LocalDateTime toDate;
    private String description;
    private String status;
    private String priority;
    private String choosedOption;

}
