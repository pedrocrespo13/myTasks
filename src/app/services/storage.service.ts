import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { ReplaySubject, firstValueFrom } from 'rxjs';

/**
 * Serviço fino para encapsular o Ionic Storage e garantir
 * que apenas começamos a ler/gravar depois da criação do
 * storage. Mantém o código das páginas mais limpo.
 */
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private storageReady = new ReplaySubject<Storage>(1);

  constructor(private storageCtrl: Storage) {
    this.initStorage();
  }

  private async initStorage(): Promise<void> {
    const storage = await this.storageCtrl.create();
    this.storageReady.next(storage);
  }

  async get<T>(key: string, fallback: T): Promise<T> {
    const storage = await firstValueFrom(this.storageReady);
    const value = await storage.get(key);
    return (value as T) ?? fallback;
  }

  async set<T>(key: string, value: T): Promise<void> {
    const storage = await firstValueFrom(this.storageReady);
    await storage.set(key, value);
  }
}

