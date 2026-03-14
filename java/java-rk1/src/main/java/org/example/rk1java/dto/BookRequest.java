package org.example.rk1java.dto;

public class BookRequest {
    private String title;
    private String internationalStandardBookNumber;

    public BookRequest() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getInternationalStandardBookNumber() {
        return internationalStandardBookNumber;
    }

    public void setInternationalStandardBookNumber(String internationalStandardBookNumber) {
        this.internationalStandardBookNumber = internationalStandardBookNumber;
    }
}
