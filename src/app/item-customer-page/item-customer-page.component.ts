import { CartService } from './../services/cart.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserBusiness } from './../user/userbusiness';
import { UserService } from './../user/user.service';
import { AuthService } from './../auth/auth.service';
import { Item } from 'src/app/item/item';
import { Router, NavigationEnd } from '@angular/router';
import { ItemsService } from './../item/items.service';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-item-customer-page',
  templateUrl: './item-customer-page.component.html',
  styleUrls: ['./item-customer-page.component.scss']
})
export class ItemCustomerPageComponent implements OnInit{

  item: Item;
  justLoaded: boolean = true;
  itemNotFound: boolean = false;
  otherItems: Item[];
  itemID: string;
  businessData: UserBusiness;
  newBusiness: boolean;

  quantity: number = 1;
  quantityForm: FormGroup;
  quantityModel: number = 1;

  navigationSubscription: Subscription;
  inCart: boolean;
  cartID: string;

  isLoggedIn: boolean = false;

  constructor(private itemsService: ItemsService, private router: Router,
    iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private authService: AuthService,
    private userService: UserService, private formBuilder: FormBuilder,
    private cartService: CartService) 
  { 
    iconRegistry.addSvgIcon(
      'add-to-cart-icon',
      sanitizer.bypassSecurityTrustResourceUrl("assets/icons/add_to_cart_icon.svg"));

      this.navigationSubscription = this.router.events.subscribe(async (e: any) => {
        const itemID = this.router.url.split('/').pop();
       
        // If it is a NavigationEnd event re-initalise the component
        if (e instanceof NavigationEnd) {
          try
          {
            await this.getItemData(itemID)
            this.getInCart();
            this.getItemsOfBusiness();
            if(this.newBusiness)
            {  
              this.getBusinessInfo();
            }
            
          }
          catch(e)
          {
            console.log("error", e);
          }
        }
      });

      this.quantityForm = this.formBuilder.group({
        quantity: ["1", [Validators.required, Validators.pattern('[1-9][0-9]{0,3}')]],
      });

      this.justLoaded = true;
  }

  async ngOnInit() 
  {
    this.itemID = this.router.url.split('/').pop();
    await this.getItemData(this.itemID);

    if(this.item)
    {
      this.getInCart();
      this.getItemsOfBusiness();
      this.getBusinessInfo();
    }
    
    this.isLoggedIn = this.authService.isLoggedIn;
  }

  async btnAddToCart()
  {
    await this.cartService.addInventoryItemToCart(this.item, this.quantityForm.get('quantity').value, 
      this.authService.userID, this.inCart, this.cartID).then(() => this.getInCart());
  }

  getFinalPrice(): number
  {
    if(this.quantityForm.valid)
      return this.quantityForm.get('quantity').value * this.item.price;
    else
      return 0;
  }

  getInCart()
  {
    this.cartService.getCartsForUser(this.authService.userID);
    const cartID = this.cartService.getInCart(this.item);
    this.inCart = cartID != null;
    if(cartID)
      this.cartID = cartID;
  }

  async getItemData(itemID: string)
  {
    await this.itemsService.getInventoryItem(itemID).then((item) => 
    {
      if(!this.item)
        this.newBusiness = true;
      else if(this.item.businessID != item.businessID)
        this.newBusiness = true;
      else
        this.newBusiness = false;  

      this.item = item;
      this.itemNotFound = false;
      this.justLoaded = false;
      
    }, (err) =>
    {
      console.log(err);
      this.itemNotFound = true;
      this.justLoaded = false;
      this.item = null;
      this.newBusiness = false;  
    });
  }

  async getItemsOfBusiness()
  {
    
    let items: Item[] = await this.itemsService.getInventoryItemsOfBusiness(this.item.businessID);
    let index = items.findIndex((item) => item.id == this.item.id); //exclude current item
    items.splice(index, 1);
    this.otherItems = items;
  }

  async getBusinessInfo()
  {
    this.businessData = await this.userService.getUser2(this.item.businessID) as UserBusiness;
  }

  ngOnDestroy() {
    this.navigationSubscription.unsubscribe();
  }
}
