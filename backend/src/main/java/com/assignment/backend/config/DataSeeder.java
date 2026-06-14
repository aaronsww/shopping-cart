package com.assignment.backend.config;

import com.assignment.backend.entity.Product;
import com.assignment.backend.repository.ProductRepository;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

        private final ProductRepository productRepository;

        public DataSeeder(ProductRepository productRepository) {
                this.productRepository = productRepository;
        }

        @Override
        public void run(String... args) {
                if (productRepository.count() > 0) {
                        return;
                }

                productRepository.saveAll(sampleProducts());
        }

        // used data from an old api I was using in my frontend 
        private List<Product> sampleProducts() {
                return List.of(
                                product("Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops", "109.95",
                                                "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png"),
                                product("Mens Casual Premium Slim Fit T-Shirts ", "22.3",
                                                "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png"),
                                product("Mens Cotton Jacket", "55.99",
                                                "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_t.png"),
                                product("Mens Casual Slim Fit", "15.99",
                                                "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_t.png"),
                                product("John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
                                                "695",
                                                "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_t.png"),
                                product("Solid Gold Petite Micropave ", "168",
                                                "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_t.png"),
                                product("White Gold Plated Princess", "9.99",
                                                "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_t.png"),
                                product("Pierced Owl Rose Gold Plated Stainless Steel Double", "10.99",
                                                "https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_t.png"),
                                product("WD 2TB Elements Portable External Hard Drive - USB 3.0 ", "64",
                                                "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_t.png"),
                                product("SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s", "109",
                                                "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_t.png"),
                                product("Silicon Power 256GB SSD 3D NAND A55 SLC Cache Performance Boost SATA III 2.5",
                                                "109",
                                                "https://fakestoreapi.com/img/71kWymZ+c+L._AC_SX679_t.png"),
                                product("WD 4TB Gaming Drive Works with Playstation 4 Portable External Hard Drive",
                                                "114",
                                                "https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_t.png"),
                                product("Acer SB220Q bi 21.5 inches Full HD (1920 x 1080) IPS Ultra-Thin", "599",
                                                "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_t.png"),
                                product("Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor (LC49HG90DMNXZA) – Super Ultrawide Screen QLED ",
                                                "999.99",
                                                "https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_t.png"),
                                product("BIYLACLESEN Women's 3-in-1 Snowboard Jacket Winter Coats", "56.99",
                                                "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_t.png"),
                                product("Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket",
                                                "29.95",
                                                "https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_t.png"),
                                product("Rain Jacket Women Windbreaker Striped Climbing Raincoats", "39.99",
                                                "https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2t.png"),
                                product("MBJ Women's Solid Short Sleeve Boat Neck V ", "9.85",
                                                "https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_t.png"),
                                product("Opna Women's Short Sleeve Moisture", "7.95",
                                                "https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_t.png"),
                                product("DANVOUY Womens T Shirt Casual Cotton Short", "12.99",
                                                "https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_t.png"));
        }

        private Product product(String title, String price, String imageUrl) {
                return Product.builder()
                                .title(title)
                                .price(new BigDecimal(price))
                                .imageUrl(imageUrl)
                                .build();
        }
}
