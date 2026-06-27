import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AnnonceMateriel } from '../../../../core/models/annonce-materiel.model';
import { AnnonceMaterielService } from '../../../../core/services/annonce-materiel.service';

@Component({
  selector: 'app-bourse-materiel',
  standalone: true,
  imports: [NgFor, NgIf, DecimalPipe, RouterLink, FormsModule],
  templateUrl: './bourse-materiel.component.html',
  styleUrls: ['./bourse-materiel.component.css']
})
export class BourseMaterielComponent implements OnInit {
  annonces: AnnonceMateriel[] = [];
  filtreType = '';

  constructor(private service: AnnonceMaterielService) {}

  ngOnInit() {
    this.service.getAll().subscribe(data => this.annonces = data);
  }

  get filtrees(): AnnonceMateriel[] {
    if (!this.filtreType) return this.annonces;
    return this.annonces.filter(a => a.typeTransaction === this.filtreType);
  }
}
