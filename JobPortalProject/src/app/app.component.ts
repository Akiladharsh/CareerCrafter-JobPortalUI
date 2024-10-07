import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // For router outlet
import { HeaderComponent } from './header/header.component'; // Import HeaderComponent
import { FooterComponent } from './footer/footer.component'; // Import FooterComponent
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import FormsModule and ReactiveFormsModule

@Component({
  selector: 'app-root',
  standalone: true, // Indicates that this component is a standalone component
  imports: [RouterOutlet, HeaderComponent, FooterComponent, HttpClientModule, FormsModule, ReactiveFormsModule], // Include all components and modules
  templateUrl: './app.component.html', // Path to your HTML template
  styleUrls: ['./app.component.css'] // Path to your CSS styles
})
export class AppComponent {
  title = 'JobPortalProject'; // Define the title property
}
