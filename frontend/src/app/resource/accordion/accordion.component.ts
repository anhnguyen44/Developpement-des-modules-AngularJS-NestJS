import { Component, ContentChildren, QueryList, AfterContentInit, ChangeDetectorRef, AfterViewInit, ChangeDetectionStrategy, AfterViewChecked, Output, EventEmitter } from '@angular/core';
import { AccordionGroupComponent } from './accordion-group.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'accordion',
  template: `
    <ng-content></ng-content>
`,
  styleUrls: ['./accordion.component.css']
})
export class AccordionComponent implements AfterContentInit, AfterViewChecked {
  @Output() openedGroup: EventEmitter<AccordionGroupComponent> = new EventEmitter<AccordionGroupComponent>()
  @ContentChildren(AccordionGroupComponent)
  groups: QueryList<AccordionGroupComponent>;

  constructor(private cd: ChangeDetectorRef) {
  }

  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }

  /**
   * Invoked when all children (groups) are ready
   */
  ngAfterContentInit() {
    // console.log (this.groups);
    setTimeout(() => {
      if (this.groups && this.groups.toArray()[0] && this.groups.toArray().findIndex(g => g.opened) === -1) {
        this.groups.toArray()[0].opened = true;
      }
    });
    // Loop through all Groups
    this.groups.toArray().forEach((t) => {
      // when title bar is clicked
      // (toggle is an @output event of Group)
      t.toggle.subscribe(() => {
        // Open the group
        this.openGroup(t);
      });
      /*t.toggle.subscribe((group) => {
        // Open the group
        this.openGroup(group);
      });*/
    });

    this.groups.changes.subscribe(() => {
      // console.log (this.groups);
      // Set active to first element
      setTimeout(() => {
        if (this.groups && this.groups.toArray()[0] && this.groups.toArray().findIndex(g => g.opened) === -1) {
          this.groups.toArray()[0].opened = true;
        }
      });
      // Loop through all Groups
      this.groups.toArray().forEach((t) => {
        // when title bar is clicked
        // (toggle is an @output event of Group)
        t.toggle.subscribe(() => {
          // Open the group
          this.openGroup(t);
        });
        /*t.toggle.subscribe((group) => {
          // Open the group
          this.openGroup(group);
        });*/
      });
    });
  }

  /**
   * Open an accordion group
   * @param group   Group instance
   */
  openGroup(group: any) {
    // close other groups
    this.groups.toArray().forEach((t) => t.opened = false);
    // open current group
    group.opened = true;
    this.openedGroup.emit(group);
  }
}
