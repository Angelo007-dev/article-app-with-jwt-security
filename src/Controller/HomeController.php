<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends AbstractController
{
    #[Route('/login', name: 'app_home')]
    public function index(): Response
    {
        return $this->render('home/home.html.twig', []);
    }
    #[Route('/home/loader', name: 'app_home_load')]
    public function load(): Response
    {
        return $this->render('home/load.html.twig', []);
    }
}
