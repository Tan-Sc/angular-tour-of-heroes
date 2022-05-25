import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Hero } from './hero';
import { HEROES } from './mock-hero';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class HeroService {
    //service in service
    constructor(
        private http: HttpClient,
        private messageService: MessageService
    ) { }

    private heroesUrl = 'api/heroes';

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.log(error);

            this.log(`${operation} failed: ${error.message}`);

            return of(result as T);
        };
    }


    /** Log a HeroService message with the MessageService */
    private log(message: string) {
        this.messageService.add(`HeroService: ${message}`);
    }

    //[GET] hero from the server
    getHeroes(): Observable<Hero[]> {
        return this.http.get<Hero[]>(this.heroesUrl).pipe(
            tap((_) => this.log('fetched heroes')),
            catchError(this.handleError<Hero[]>('getHeroes', []))
        );
    }

    //  [GET] hero by id. and return 404 id not found
    getHero(id: number): Observable<Hero> {
        // For now, assume that a hero with the specified `id` always exists.
        // Error handling will be added in the next step of the tutorial.
        // const hero = HEROES.find(h => h.id === id)!;
        // this.messageService.add(`HeroService: fetched hero id=${id}`);
        // return of(hero);
        const url = `${this.heroesUrl}/${id}`;
        return this.http.get<Hero>(url).pipe(
            tap((_) => this.log(`fetched hero id=${id}`)),
            catchError(this.handleError<Hero>(`getHero id=${id}`))
        );
    }

    updateHero(hero: Hero): Observable<any> {
        return this.http.put(this.heroesUrl, hero, this.httpOpitons).pipe(
            tap((_) => this.log(`update hero id=${hero.id}`)),
            catchError(this.handleError<any>('updateHero'))
        );
    }
    // [POST]  add new hero
    addHero(hero: Hero): Observable<Hero> {
        return this.http.post<Hero>(this.heroesUrl, hero, this.httpOpitons).pipe(
            tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
            catchError(this.handleError<Hero>('addHero'))
        );
    }
    deletedHero(id: Number): Observable<Hero> {
        const url = `${this.heroesUrl}/${id}`;

        return this.http.delete<Hero>(url, this.httpOpitons).pipe(
            tap((_ => this.log(`deleted hero id=${id}`)),
                catchError(this.handleError<Hero>('deleteHero'))
            )
        );
    }
    /* GET heroes whose name contains search term */
    searchHeros(term: string): Observable<Hero[]> {
        if (!term.trim()) {
            return of([]);
        }

        return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
            tap(x => x.length ?
                this.log(`found heroes matching "${term}`) :
                this.log(`not found heroes  "${term}`),
                catchError(this.handleError<Hero[]>('searchHeros', []))
            )
        );
    }

    httpOpitons = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
}
