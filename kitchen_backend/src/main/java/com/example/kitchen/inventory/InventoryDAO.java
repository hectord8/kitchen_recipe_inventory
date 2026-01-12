package com.example.kitchen.inventory;


import org.jdbi.v3.sqlobject.config.RegisterBeanMapper;
import org.jdbi.v3.sqlobject.statement.GetGeneratedKeys;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.customizer.BindBean;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.config.RegisterConstructorMapper;

import java.util.List;

@RegisterBeanMapper(Inventory.class)
public interface InventoryDAO {
    @SqlUpdate("""
            INSERT INTO inventory(
                customer_Id,
                item,
                description,
                image,
                quantity
            )
            VALUES(
                :customerId,
                :item,
                :description,
                :image,
                :quantity
            )
            """)
    @GetGeneratedKeys
    Inventory insert(@BindBean Inventory inventory);

    @SqlQuery("""
            SELECT item_id, customer_Id, item, description, image, quantity
            FROM inventory
            ORDER BY customer_Id DESC
            """)
    List<Inventory> getAllItems();

    @SqlQuery("""
            SELECT item_id, customer_Id, item, description, image, quantity
            FROM inventory
            WHERE customer_Id = :customerId
            ORDER BY customer_Id DESC
            """)
    List<Inventory> getAllItemsById(@Bind("customerId") int customerId);


    @SqlQuery("""
                    SELECT quantity, item_id
                    from inventory
                    where item_id = :itemId
            
            """)
    @RegisterConstructorMapper(InventoryDTO.QuantityResponse.class)
    InventoryDTO.QuantityResponse getQuantityByItemId(@Bind("itemId") int itemId);

    @SqlQuery("""
                    UPDATE inventory set quantity = quantity + 1
            
                    where item_id = :itemId
                     AND quantity >= 0
                     RETURNING quantity;
            
            """)
    int increaseQuantity(@Bind("itemId") int itemId);

    @SqlQuery("""
                    UPDATE inventory 
                    set quantity = quantity - 1
            
                    where item_id = :itemId
                     AND quantity > 0
                     RETURNING quantity;
                     
                     DELETE FROM inventory
                     where quantity <= 0
                     
            
            """)
    int decreaseQuantity(@Bind("itemId") int itemId);


}
