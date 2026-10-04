import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { ContatsComponent } from './contats.component';
import { environment } from '../../../environments/environment';

describe('ContatsComponent', () => {
  let component: ContatsComponent;
  let fixture: ComponentFixture<ContatsComponent>;
  let httpMock: HttpTestingController;
  const originalAccessKey = environment.web3formsAccessKey;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContatsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideTranslateService()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContatsComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    environment.web3formsAccessKey = originalAccessKey;
    httpMock.verify();
  });

  function fillValidForm(): void {
    component.contactForm.setValue({
      name: 'Test',
      email: 'test@example.com',
      subject: 'Subject',
      message: 'Message',
      botcheck: '',
    });
    // Bypass the "submitted too fast" bot heuristic.
    component['formLoadedAt'] = Date.now() - 5000;
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call Web3Forms when the access key is blank', () => {
    environment.web3formsAccessKey = '   ';
    fillValidForm();

    component.onSubmit();

    httpMock.expectNone('https://api.web3forms.com/submit');
    expect(component.error).toBeTrue();
    expect(component.sending).toBeFalse();
    expect(component.submitted).toBeFalse();
  });

  it('should submit when the access key is configured', () => {
    environment.web3formsAccessKey = 'a-valid-key';
    fillValidForm();

    component.onSubmit();

    const request = httpMock.expectOne('https://api.web3forms.com/submit');
    expect(request.request.body.access_key).toBe('a-valid-key');
    request.flush({ success: true });

    expect(component.submitted).toBeTrue();
    expect(component.error).toBeFalse();
    expect(component.sending).toBeFalse();
  });
});
