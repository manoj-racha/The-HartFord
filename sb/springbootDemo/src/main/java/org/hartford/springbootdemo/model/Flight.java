package org.hartford.springbootdemo.model;

public class Flight {
    private int id;
    private String source;
    private String destination;
    private String departureTime;
    private String departureDate;

    @Override
    public String toString() {
        return "Flight{" +
                "id=" + id +
                ", source='" + source + '\'' +
                ", destination='" + destination + '\'' +
                ", departureTime='" + departureTime + '\'' +
                ", departureDate='" + departureDate + '\'' +
                '}';
    }

    public Flight(int id, String source, String destination, String departureTime, String departureDate) {
        this.id = id;
        this.source = source;
        this.destination = destination;
        this.departureTime = departureTime;
        this.departureDate = departureDate;
    }

    public Flight() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public String getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(String departureTime) {
        this.departureTime = departureTime;
    }

    public String getDepartureDate() {
        return departureDate;
    }

    public void setDepartureDate(String departureDate) {
        this.departureDate = departureDate;
    }
}
