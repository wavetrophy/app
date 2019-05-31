import { RequiresConnectionDirective } from './requires-connection.directive';
import { inject } from '@angular/core';
import { NetworkService } from '../../services/network/network.service';

describe('OnlineDirective', () => {
  it('should create an instance', () => {
    const directive = new RequiresConnectionDirective(inject(NetworkService));
    expect(directive).toBeTruthy();
  });
});
