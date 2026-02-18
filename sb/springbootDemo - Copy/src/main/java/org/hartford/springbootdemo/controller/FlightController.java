package org.hartford.springbootdemo.controller;

import org.hartford.springbootdemo.model.Flight;
import org.hartford.springbootdemo.service.FlightService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@ResponseBody
@RequestMapping("/flights")
public class FlightController {
    FlightService flightService;

    public FlightController(FlightService flightService) {
        this.flightService = flightService;
    }

    @PostMapping
    public Flight addFlight(@RequestBody Flight flight){
        return flightService.save(flight);
    }
//@RequestMapping("/add/{id}/{source}/{destination}/{departureTime}/{departureDate}")
//public Flight addFlight(@PathVariable int id, @PathVariable String source,@PathVariable String destination,@PathVariable String departureTime,@PathVariable String departureDate){
//    return flightService.save(new Flight(id,source,destination,departureTime,departureDate));
//}

    @DeleteMapping("/{id}")
    public boolean removeFlight(@PathVariable int id){
        return flightService.deleteById(id);
    }

    @GetMapping
    public List<Flight> findAllFlights(){
        return flightService.findAll();
    }

    @GetMapping("/{id}")
    public Flight findFlightById(@PathVariable int id){
        return flightService.findById(id);
    }


    @GetMapping("/{source}/{destination}/{departureDate}")
    public List<Flight> findBySourceAndDestinationAndDepartureTime(@PathVariable String source, @PathVariable String destination, @PathVariable String departureDate){
        return flightService.findBySourceAndDestinationDepartureDate(source, destination, departureDate);
    }

    @PutMapping("/{id}")
    public Flight update(@PathVariable int id, @RequestBody Flight flight){
        return flightService.update(id, flight);
    }

}
