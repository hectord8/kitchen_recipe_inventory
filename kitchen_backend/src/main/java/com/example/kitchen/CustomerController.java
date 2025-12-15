package com.example.kitchen;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;




// REST Controller for managing Customers
@RestController
@RequestMapping("/Customers")
public class CustomerController {


    @Autowired
    private CustomerDAO CustomerDao;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public CustomerController(CustomerDAO CustomerDao, PasswordEncoder passwordEncoder) {
        this.CustomerDao = CustomerDao;
        this.passwordEncoder = passwordEncoder;
    }





    // GET endpoint to fetch all Customers
    @GetMapping("/{firstName}")
    public Customer getCustomerByFirstName(@PathVariable String firstName) {
        return CustomerDao.getCustomerByLogin(firstName);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Customer body) {

        System.out.println("HIT /login");
        System.out.println("firstName=" + body.getFirstName());
        System.out.println("passWord=" + body.getPassWord());
        try {
            Customer db = CustomerDao.getCustomerByLogin(body.getFirstName());
            System.out.println("passWord=" + db.getPassWord());
            boolean ok = passwordEncoder.matches(body.getPassWord(), db.getPassWord());
            if (!ok) return ResponseEntity.status(401).body("Invalid login");

            session.setAttribute("customerId", db.getId());
            session.setAttribute("firstName", db.getFirstName());

            db.setPassWord(null);
            return ResponseEntity.ok(db);

        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid login");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<Customer> insert(@RequestBody Customer customer) {
        String hashed = passwordEncoder.encode(customer.getPassWord());
        customer.setPassWord(hashed);
        Customer saved = CustomerDao.insert(customer);

        return ResponseEntity.ok(saved);
    }
}