package com.shoppyBag.ServiceImpl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.shoppyBag.DTO.AddressRequest;
import com.shoppyBag.DTO.AddressResponse;
import com.shoppyBag.Entity.Address;
import com.shoppyBag.Entity.Users;
import com.shoppyBag.Repository.AddressRepository;
import com.shoppyBag.Service.AddressService;

@Service
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;

    public AddressServiceImpl(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }

    @Override
    public Address addAddress(AddressRequest request, Users user) {

        Address address = new Address();
        address.setLine1(request.getLine1());
        address.setLine2(request.getLine2());
        address.setState(request.getState());
        address.setCountry(request.getCountry());
        address.setPincode(request.getPincode());
        address.setUsers(user);

        return addressRepository.save(address);
    }


    @Override
    public List<Address> getUserAddresses(Users user) {
        return addressRepository.findByUsers(user);
    }

    @Override
    public Address updateAddress(Long id, AddressRequest updatedAddress, Users user) {
        Address existing = addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (!existing.getUsers().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access");
        }

        existing.setLine1(updatedAddress.getLine1());
        existing.setLine2(updatedAddress.getLine2());
        existing.setState(updatedAddress.getState());
        existing.setCountry(updatedAddress.getCountry());
        existing.setPincode(updatedAddress.getPincode());

        return addressRepository.save(existing);
    }

    @Override
    public void deleteAddress(Long id, Users user) {
        Address addr = addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (!addr.getUsers().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access");
        }

        addressRepository.delete(addr);
    }
}
