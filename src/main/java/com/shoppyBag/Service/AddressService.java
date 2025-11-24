package com.shoppyBag.Service;

import java.util.List;
import com.shoppyBag.Entity.Address;
import com.shoppyBag.Entity.Users;
import com.shoppyBag.DTO.AddressRequest;

public interface AddressService {
    Address addAddress(AddressRequest request, Users user);
    List<Address> getUserAddresses(Users user);
    Address updateAddress(Long id, AddressRequest request, Users user);
    void deleteAddress(Long id, Users user);
}
