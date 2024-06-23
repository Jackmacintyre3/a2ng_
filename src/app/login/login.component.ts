import { Component } from '@angular/core';
import { LoginService } from '../login.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Login } from '../login';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  isLoggedIn: boolean = false;

  constructor(private loginService: LoginService) {}

  login(event: Event): void {
    event.preventDefault();
    if (!this.email || !this.password) {
      alert('Please enter both email and password.');
      return;
    }

    this.loginService.getLogin().subscribe(
      (logins: Login[]) => {
        const user = logins.find(u => u.email === this.email && u.password === this.password);
        if (user) {
          this.loginService.setLoggedIn(true);
        } else {
        }
      },
    );
  }
}
