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
        Iterator<Flight> it = flights.iterator();
        while(it.hasNext()){
            Flight f = it.next();
            if(f.getId()==id){
                return f;
            }
        }
        return null;
    }

    @Override
    public List<Flight> findBySourceAndDestinationDepartureDate(String source, String destination, String departureDate) {
        Iterator<Flight> it = flights.iterator();
        List<Flight> flights = new ArrayList<>();
        while(it.hasNext())
        {
            Flight f = it.next();
            if(f.getSource().equals(source) && f.getDestination().equals(destination) && f.getDepartureDate().equals(departureDate))
            {
                flights.add(f);
            }
        }
        return flights;
    }
}
