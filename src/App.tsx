import React, { Component } from 'react';
import './App.css';

import {Grid, GridColumn, GridSortSettings, GridSortChangeEvent, GridFilterChangeEvent} from '@progress/kendo-react-grid';
// Used for sorting and filtering grid content
import { orderBy, SortDescriptor, filterBy, CompositeFilterDescriptor, FilterDescriptor} from '@progress/kendo-data-query';

import initialProducts from './data/products.json';

interface ProductCategory {
  CategoryID : number,
  CategoryName : string,
  Description : string
}
interface Product {
  ProductID : number,
  ProductName : string,
  SupplierID : number,
  CategoryID : number,
  QuantityPerUnit : string,
  UnitPrice : number,
  UnitsInStock : number,
  UnitsOnOrder : number,
  ReorderLevel : number,
  Discontinued : boolean,
  Category : ProductCategory
}

interface AppProps { }
interface AppState {
  products: Product[],
  sort: SortDescriptor[]
  filter: CompositeFilterDescriptor;
}

class App extends Component<AppProps, AppState> {
  private appName: string = 'My second app with React, TypeScript, KendoReact Grid';

  constructor(props: AppProps) {
    super(props);
    this.state = {
      products: initialProducts,
      sort: [
        {field: 'price', dir: 'asc'} as SortDescriptor
      ],
      filter: { 
        logic: 'and', 
        filters: [
          { 
            field: 'ProductName', 
            operator: 'contains', 
            value: 'j', 
            ignoreCase: true 
          }
        ]  
      }
    };
  }

  render() {
    let products = filterBy(this.state.products, this.state.filter);
    products = orderBy(products, this.state.sort);
    const sortSettings: GridSortSettings = { mode: 'single', allowUnsort: false };

    return (
      <div>
        <h1>{this.appName}</h1>
        <Grid data={products} 

              sortable={sortSettings} 
              sort={this.state.sort} 
              onSortChange={(e)=>this.onSortChanged(e)}

              filterable
              filter={this.state.filter}
              onFilterChange={(e)=>this.onFilterChanged(e)}
        >
          <GridColumn field="ProductID"    title="Product ID"           filter="numeric"/>
          <GridColumn field="ProductName"  title="Product name"/>
          <GridColumn field="UnitPrice"    title="Price" format="{0:c}" filter="numeric"/>
          <GridColumn field="UnitsInStock" title="Count"                filter="numeric"/>
        </Grid>
      </div>
    );
  }

  public onSortChanged(event: GridSortChangeEvent): void {
    this.setState({sort : event.sort});
    if (event.sort.length > 0) {
      console.log(`Sort ${event.sort[0].field} ${event.sort[0].dir}`);
    } else {
      console.log('Unsorted');
    }
  }

  public onFilterChanged(event: GridFilterChangeEvent): void {
    this.setState({filter: event.filter});
    if (event.filter != null) {
      console.log(`Filter logical operator: ${event.filter.logic}`);
      for (let fd of event.filter.filters) {
        if ((fd as FilterDescriptor).field) {}
        const fd2: FilterDescriptor = fd as FilterDescriptor;
        console.log(`  ${fd2.field} ${fd2.operator} ${fd2.value}`);
      }  
    }
  }
}

export default App;
