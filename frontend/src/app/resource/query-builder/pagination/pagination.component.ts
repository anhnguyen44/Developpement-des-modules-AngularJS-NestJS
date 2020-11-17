import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserService } from '../../user/user.service';
import { UserStore } from '../../user/user.store';
import { QueryBuild } from '../QueryBuild';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
    @Input() queryBuild: QueryBuild;
    @Input() nbObjets: number;
    @Output() emitQueryBuild = new EventEmitter<QueryBuild>();

    constructor(private userService: UserService, private userStore: UserStore) { }

    changeParPage(parPage) {
        if (this.queryBuild.parPage && this.queryBuild.pageEnCours) {
            const maxPage = this.nbObjets / this.queryBuild.parPage;
            if (maxPage < this.queryBuild.pageEnCours) {
                this.queryBuild.pageEnCours = Math.ceil(maxPage);
            }
            this.queryBuild.needCount = false;
            this.emitQueryBuild.emit(this.queryBuild);
        }
    }

    onPrev(): void {
        if (this.queryBuild.pageEnCours && this.queryBuild.pageEnCours > 1) {
            this.queryBuild.needCount = false;
            this.queryBuild.pageEnCours -= 1;
            this.emitQueryBuild.emit(this.queryBuild);
        }
    }

    onNext(next: boolean): void {
        if (!this.lastPage() && this.queryBuild.pageEnCours) {
            this.queryBuild.pageEnCours += 1;
            this.queryBuild.needCount = false;
            this.emitQueryBuild.emit(this.queryBuild);
        }
    }

    totalPages(): number | undefined {
        if (this.queryBuild.parPage) {
            return Math.ceil(this.nbObjets / this.queryBuild.parPage) || 0;
        }
    }

    lastPage(): boolean | undefined {
        if (this.queryBuild.parPage && this.queryBuild.pageEnCours) {
            return this.queryBuild.parPage * this.queryBuild.pageEnCours > this.nbObjets;
        }
    }
}
