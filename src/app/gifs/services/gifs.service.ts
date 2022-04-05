import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponse, Gif } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {
  private apiKey: string = 'saENdXvvBfHSW3PPlt2e2SvW3uUDuHvn';
  private url: string = 'https://api.giphy.com/v1/gifs';
  private history: string[] = [];

  result: Gif[] = [];

  get publicHistory(): string[] {
    return [...this.history];
  };

  constructor(private http: HttpClient) {
    this.history = JSON.parse(localStorage.getItem('log')!) || [];
    this.result = JSON.parse(localStorage.getItem('results')!) || [];
  }

  searchGifs(query: string) {
    query = query.trim().toLowerCase();
    if (!this.history.includes(query)) {
      this.history.unshift(query);
      this.history = this.history.splice(0, 10);
      localStorage.setItem('log', JSON.stringify(this.history));
    }

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', query);

    this.http.get<SearchGifsResponse>(`${this.url}/search`, { params }).subscribe((response: any) => {
      this.result = response.data;
      localStorage.setItem('results', JSON.stringify(this.result));
    });
  }
}
