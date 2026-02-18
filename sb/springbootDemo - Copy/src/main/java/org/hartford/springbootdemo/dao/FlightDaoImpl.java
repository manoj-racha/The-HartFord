package org.hartford.springbootdemo.dao;

import org.hartford.springbootdemo.model.Flight;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
@Component
public class FlightDaoImpl implements FlightDao{

    List<Flight> flights = new ArrayList<>();
    @Override
    public Flight save(Flight flight) {
        flights.add(flight);
        return flight;
    }

    @Override
    public boolean deleteById(int id) {

        Iterator<Flight> it = flights.iterator();
        while(it.hasNext()){
            Flight f = it.next();
            if(f.getId()==id){
                it.remove();
                return true;
            }
        }
        return false;
    }

    @Override
    public List<Flight> findAll() {
        return flights;
    }

    @Override
    public Flight findById(int id) {
        return flights.stream().filter(f -> f.getId() == id).toList().get(0);
    }

    @Override
    public List<Flight> findBySourceAndDestinationDepartureDate(String source, String destination, String departureDate) {
        return flights.stream().filter(f -> f.getSource().equals(source))
                .filter(f -> f.getDestination().equals(destination))
                .filter(f -> f.getDepartureDate().equals(departureDate)).toList();
    }

    @Override
    public Flight update(int id, Flight flight) {
        Iterator<Flight> it = flights.iterator();
        Flight f = null;
        while(it.hasNext())
        {
             f = it.next();
            if(f.getId()==id)
            {
                f.setDestination(flight.getDestination());
                f.setSource(flight.getSource());
                f.setDepartureTime(flight.getDepartureTime());
                f.setDepartureDate(flight.getDepartureDate());
                return f;
            }
        }

        return null;
    }
}
