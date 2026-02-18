package org.hartford.springbootdemo.service;

import org.hartford.springbootdemo.dao.FlightDao;
import org.hartford.springbootdemo.model.Flight;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class FlightServiceImpl implements FlightService{
    @Autowired
    private FlightDao flightDao;

    @Override
    public Flight save(Flight flight) {
        return flightDao.save(flight);
    }

    @Override
    public boolean deleteById(int id) {
        return flightDao.deleteById(id);
    }

    @Override
    public List<Flight> findAll() {
        return flightDao.findAll();
    }

    @Override
    public Flight findById(int id) {
        return flightDao.findById(id);
    }

    @Override
    public List<Flight> findBySourceAndDestinationDepartureDate(String source, String destination, String departureDate) {
        return flightDao.findBySourceAndDestinationDepartureDate(source,destination,departureDate);
    }
}
