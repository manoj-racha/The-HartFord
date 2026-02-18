package org.hartford.springbootdemo.service;

import org.hartford.springbootdemo.model.Flight;

import java.util.List;

public interface FlightService {
    Flight save(Flight flight);
    boolean deleteById(int id);
    List<Flight> findAll();
    Flight findById(int id);
    List<Flight> findBySourceAndDestinationDepartureDate(String source,String destination,String departureDate);
}
